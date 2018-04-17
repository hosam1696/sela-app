export interface PageMode {
  editMode: boolean,
  editText: string
}

export interface UserData {
  address: string,
  c_code: string,
  created_at?: string,
  email: string,
  email_active?: number,
  first_name: string,
  id: number,
  last_name: string,
  mobile_token: string|null,
  mobile_type: string|null,
  name: string|null,
  phone: string,
  role: string| number,
  token:string,
  updated_at?:string,
  vehicle?:string|null
}

export interface MenuPage {
  title: string,
  component: any,
  icon: string,
  params?: any,
  noUserLogged?: boolean,
}
export  interface  Order {
  branch_id: number,
  created_at: string,
  id: number,
  notes: string,
  status: number,
  total: string,
  type: string,
  updated_at: string,
  user_id: number
}
