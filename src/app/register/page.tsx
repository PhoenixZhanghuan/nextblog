import RegisterForm from '../components/RegisterForm'
import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            创建新账户
          </h2>
        </div>
        <RegisterForm />
        <div className="text-center">
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
            已有账户？点击登录
          </Link>
        </div>
      </div>
    </div>
  )
}