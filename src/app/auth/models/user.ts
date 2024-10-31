export interface ResponseBody {
  message: string
  statusCode: number
  status: string
  body: User
}

export interface User {
  userId: number
  emailId: string
  userName: string
  password?: string
  confirmPassword?: string
  phoneNumber?: string
  role?: string
  jwt?: string
  firstName?: string
  lastName?: string
  countryId?: number
  stateId?: number
  cityId?: number
}

export interface AdminUser {
  user_id: number
  email_id: string
  user_name: string
  password?: string
  confirmPassword?: string
  role?: string
  jwt?: string
}

export interface RegisterUser {
  emailId: string
  userName: string
  password: string
  confirmPassword?: string
  phoneNumber: number
  role?: string
}
