import ProfileHeader from "./ProfileHeader";
import UpdateProfileForm from "./UpdateProfileForm";
import DeleteAccountContainer from "./DeleteAccountContainer";

export default function Profile() {
  return (
    <>
      <ProfileHeader />
      <UpdateProfileForm />
      <DeleteAccountContainer />
    </>
  );
}
