const API_URL = "https://apimocha.com/fba-helper";

export async function getAllProducts() {
    try {
        const response = await fetch(`${API_URL}/getAllProducts`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}