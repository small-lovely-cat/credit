import { Suspense } from "react"
import { LoginPage } from "@/components/auth/login-page"
import { Spinner } from "@/components/ui/spinner"

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <LoginPage />
    </Suspense>
  )
}
