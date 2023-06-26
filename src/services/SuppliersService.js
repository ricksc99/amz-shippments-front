import API_URL from '../environment';

export async function getAllSuppliers(fields) {
    try {
        const response = await fetch(`${API_URL}/providers?fields=${fields}`);
        if (!response.ok) {
            throw new Error('Error fetching suppliers');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching suppliers');
    }
}

export async function getSupplierById(id) {
    try {
        const response = await fetch(`${API_URL}/providers/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching suppliers');
    }
}

export async function createSupplier(obj) {
    try {
        const response = await fetch(`${API_URL}/providers`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
          });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching suppliers');
    }
}

export async function saveSupplier(obj) {
    try {
        const response = await fetch(`${API_URL}/providers/${obj.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
          });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching suppliers');
    }
}

export async function removeSupplier(id) {
    try {
        const response = await fetch(`${API_URL}/providers/${id}`, {
            method: 'DELETE',
          });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching suppliers');
    }
}