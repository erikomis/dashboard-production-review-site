import { useSignInModel } from "./sign-in.model";
import { SignInView } from "./sign-in.view";

const SignInPage = () => {
  const methods = useSignInModel();
  return <SignInView {...methods} />;
};

export default SignInPage;
