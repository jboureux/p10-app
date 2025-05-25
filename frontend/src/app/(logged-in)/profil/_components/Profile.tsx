import { User } from "@/types/users";
import DeleteAccountContainer from "./DeleteAccountContainer";
import ProfileHeader from "./ProfileHeader";
import UpdateProfileForm from "./UpdateProfileForm";

export default function Profile({ user }: { user: User }) {
  return (
    <>
      <ProfileHeader />
      <UpdateProfileForm user={user} />
      <DeleteAccountContainer />
    </>
  );
}
