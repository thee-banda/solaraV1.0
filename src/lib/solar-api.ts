/**
 * NASA POWER API Utility for Solar Radiation Data
 * Documentation: https://power.larc.nasa.gov/docs/services/api/temporal/point/
 */

export async function getSolarData(lat: number, lon: number): Promise<number | null> {
  try {
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    const formatDate = (date: Date) => date.toISOString().split("T")[0].replace(/-/g, "");
    
    const start = formatDate(lastYear);
    const end = formatDate(new Date(today.getFullYear() - 1, 11, 31)); // Full previous year for stability
    
    const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN&community=RE&longitude=${lon}&latitude=${lat}&start=${start}&end=${end}&format=JSON`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("NASA API connection failed");
    
    const data = await response.json();
    const irradianceData = data.properties.parameter.ALLSKY_SFC_SW_DWN;
    
    if (!irradianceData) return null;

    const values = Object.values(irradianceData) as number[];
    const validValues = values.filter(v => v > 0); // Ignore -999 missing data
    
    if (validValues.length === 0) return null;
    
    const averageIrradiance = validValues.reduce((a, b) => a + b, 0) / validValues.length;
    
    // Average irradiance (kWh/m²/day) is equivalent to Peak Sun Hours
    return Number(averageIrradiance.toFixed(2));
  } catch (error) {
    console.error("Solar API Error:", error);
    return null; // Fallback handled by the caller
  }
}
