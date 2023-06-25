const API_URL = "https://apimocha.com/fba-helper";

export async function getMetricsData() {
    try {
        const response = await fetch(`${API_URL}/getMetricsData`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function getCalendarData() {
    try {
        const response = await fetch(`${API_URL}/getCalendarData`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}