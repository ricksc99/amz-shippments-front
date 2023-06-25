const API_URL = "https://apimocha.com/fba-helper";

export async function getAllOrders() {
    try {
        const response = await fetch(`${API_URL}/getAllOrders`);
        if (!response.ok) {
            throw new Error('Error fetching orders');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching orders');
    }
}

export async function getOrderById(id) {
    try {
        const response = await fetch(`${API_URL}/getOrderById/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.log(error);
    }
}