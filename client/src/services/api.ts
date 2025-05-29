import { instance } from "./instance";

interface Ilogin {
  email: String;
  password: String;
}

interface ISignUp extends Ilogin {
  firstName: String;
  lastName: String;
}

export const login = async ({ email, password }: Ilogin) => {
  const res = await instance.post("/user/login", {
    email,
    password
  });
  return res;
}

export const googleLogin = async ({ token }: { token: string }) => {
  const res = await instance.post("/user/googleLogin", {
    token
  });
  return res;
}

export const signUp = async ({ email, firstName, lastName, password }: ISignUp) => {
  const res = await instance.post("/user/signup", {
    email,
    password,
    firstName,
    lastName
  });
  return res;
}

export const home = async () => {
  const res = await instance.get("/blog/getAll");
  return res;
}

export const getImage = async ({ id }: { id: string }) => {
  const res = await instance.get(`/blog/image/${id}`)
  return res;
}

export const explore = async () => {
  const res = await instance.get("blog/category/all")
  return res;
}

export const getBlog = async ({ id }: { id: string }) => {
  const res = await instance.get(`blog/${id}`)
  return res;
}

export const getProfile = async () => {
  const res = await instance.get("/user/profile")
  return res;
}

export const createBlog = async (data: any) => {
  const res = await instance.post(`blog/create`, data)
  return res;
}

export const likeBlog = async ({ id }: { id: string }) => {
  const res = await instance.post(`blog/like/${id}`);
  return res;
}

export const deleteBlog = async ({ id }: { id: string }) => {
  const res = await instance.post(`blog/delete/${id}`);
  return res;
}

export const editBlog = async ({ id, data }: { id: string; data: any }) => {
  const res = await instance.post(`blog/edit/${id}`, data);
  return res;
}

