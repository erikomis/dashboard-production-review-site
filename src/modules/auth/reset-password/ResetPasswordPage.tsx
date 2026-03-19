import { useResetPasswordModel } from "./reset-password.model";
import { ResetPasswordView } from "./reset-password.view";

const ResetPasswordPage = () => {
  const methods = useResetPasswordModel();
  return <ResetPasswordView {...methods} />;
};

export default ResetPasswordPage;
