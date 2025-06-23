
import { useSearchParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ResetPassword } from "@/components/auth/ResetPassword";
import { UpdatePassword } from "@/components/auth/UpdatePassword";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const hasToken = searchParams.has('token');

  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-8">
        {hasToken ? <UpdatePassword /> : <ResetPassword />}
      </div>
    </MainLayout>
  );
};

export default ResetPasswordPage;
