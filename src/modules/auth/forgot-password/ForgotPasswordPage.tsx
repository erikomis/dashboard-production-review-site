import { useForgotPasswordModel } from "./forgot-password.model";
import { ForgotPasswordView } from "./forgot-password.view";

const ForgotPasswordPage = () => {
  const methods = useForgotPasswordModel();
  return <ForgotPasswordView {...methods} />;
};

export default ForgotPasswordPage;
