import api from "./base.api";
import { AxiosResponse } from "axios";

interface Contact {
  full_name: string;
  email: string;
  content: string;
  status: number;
}

const searchContacts = async (
  params: Record<string, any> = {}
): Promise<Contact[]> => {
  try {
    const response: AxiosResponse<Contact[]> = await api.get("/contacts", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const createContact = async (requestBody: any): Promise<Contact> => {
  try {
    const response: AxiosResponse<Contact> = await api.post(
      "/contacts",
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const getContactByContactId = async (contactId: string): Promise<Contact> => {
  try {
    const response: AxiosResponse<Contact> = await api.get(
      `/contacts/${contactId}`
    );
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const updateContact = async (
  contactId?: string,
  requestBody?: any
): Promise<Contact> => {
  try {
    const response: AxiosResponse<Contact> = await api.put(
      `/contacts/${contactId}`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const deleteContact = async (contactId: string): Promise<void> => {
  try {
    await api.delete(`/contacts/${contactId}`);
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};
export default {
  searchContacts,
  createContact,
  getContactByContactId,
  updateContact,
  deleteContact,
};
