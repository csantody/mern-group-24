export type User = {
  id: string
  firstName: string
  lastName: string
  login: string
  email: string
  role: string
}

export type NewUser = {
  firstName: string
  lastName: string
  email: string
  login: string
  password: string
}

async function postJson(path: string, body: object) {
  const res = await fetch('/api' + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  return { status: res.status, data }
}

export function loginUser(login: string, password: string) {
  return postJson('/login', { login, password })
}

export function registerUser(newUser: NewUser) {
  return postJson('/register', newUser)
}

export function saveUser(user: User) {
  localStorage.setItem('user', JSON.stringify(user))
}

export function getUser(): User | null {
  const saved = localStorage.getItem('user')
  return saved ? JSON.parse(saved) : null
}

export function clearUser() {
  localStorage.removeItem('user')
}