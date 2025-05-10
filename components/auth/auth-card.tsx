import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import BackButton from "./back-button";
import Socials from "./socials";
type AuthCardProps = {
  children: React.ReactNode;
  cardtitle: string;
  backButtonHref: string;
  backButtonLabel: string;
  showSocials?: boolean;
};
const AuthCard = ({
  children,
  cardtitle,
  backButtonHref,
  backButtonLabel,
  showSocials,
}: AuthCardProps) => {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>{cardtitle}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocials && (
        <CardFooter>
          <Socials />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
      </CardFooter>
    </Card>
  );
};

export default AuthCard;
