import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./useAuth";
import Category from "../types/Category";

interface AddCategoryInput {
  name: string;
  description: string;
}

interface UpdateCategoryInput {
  id: string;
  name: string;
  description: string;
}

interface CategoryStore {
  categories: Category[];
  fetchCategories: () => Promise<void>;
  addCategory: (data: AddCategoryInput) => Promise<void>;
  updateCategory: (data: UpdateCategoryInput) => Promise<void>;
  deleteCategory: ({ id }: { id: string }) => Promise<void>;
}

const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],

  fetchCategories: async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/category`);
      set({ categories: response.data });
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  },

  deleteCategory: async ({ id }) => {
    try {
      const token = useAuthStore.getState().token;
      await axios.delete(`http://localhost:5000/api/category/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      set((state) => ({
        categories: state.categories.filter((category) => category._id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  },

  updateCategory: async ({ id, name, description }) => {
    try {
      const token = useAuthStore.getState().token;
      const { data, status } = await axios.put(
        `http://localhost:5000/api/category/${id}`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (status === 200) {
        set((state) => ({
          categories: state.categories.map((category) =>
            category._id === id
              ? {
                  ...category,
                  name: data.data.name,
                  description: data.data.description,
                }
              : category
          ),
        }));
      }
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  },

  addCategory: async ({ name, description }) => {
    try {
      const token = useAuthStore.getState().token;
      const { data, status } = await axios.post(
        "http://localhost:5000/api/category",
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (status === 201) {
        set((state) => ({
          categories: [
            ...state.categories,
            {
              _id: data.data._id,
              name: data.data.name,
              description: data.data.description,
              createdAt: data.data.createdAt,
              updatedAt: data.data.updatedAt,
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  },
}));

export default useCategoryStore;
