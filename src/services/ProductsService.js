import API_URL from '../environment';

export async function getAllProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
            throw new Error('Error fetching products');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching products');
    }
}

export async function getProductById(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching products');
    }
}

export async function createProduct(obj) {
    try {
        const formData = new FormData();
        for (const key in obj) {
            if (key === "main_image" && obj[key]) {
                formData.append(
                    "main_image",
                    obj[key],
                    obj[key].name
                );
            } else {
                formData.append(key, obj[key]);
            }
        }

        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            body: formData,
            redirect: 'follow'
          });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching products');
    }
}

export async function saveProduct(obj) {
    try {
        const formData = new FormData();
        for (const key in obj) {
            if (key === "main_image" && obj[key]) {
                formData.append(
                    "main_image",
                    obj[key],
                    obj[key].name
                );
            } else {
                formData.append(key, obj[key]);
            }
        }

        formData.append("_method", "put");

        const response = await fetch(`${API_URL}/products/${obj.id}`, {
            method: 'POST',
            body: formData,
          });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching products');
    }
}

export async function removeProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE',
          });
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('Error fetching products');
    }
}