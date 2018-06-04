export interface PageMode {
  editMode: boolean,
  editText: string
}

export interface LatLng {
  lat: number,
  lng: number
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
  role: string,
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
  hide?:boolean
}

export interface PlaceNearMap {
  location: LatLng,
  distance: number,
  icon: string,
  id: string,
  rating: number & string,
  address: string,
  name?: string,
  title: string
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
  user_id: number,
  time?: number,
  payment_option: string,
  place_id?: string,
  products: any[]
}

export interface Branch {
  id: number,
  area_id: number,
  brand_id: number,
  user_id: number,
  branch_name: string,
  lat: string,
  lng: string,
  commercial_registry: string,
  
}
