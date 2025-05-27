import { callAPI } from "@/lib/api-client";
import { retrieveToken, retrieveUserId } from "@/lib/auth-server";
import { GqlError } from "@/types/errors";
import { UserResponse } from "@/types/users";
import ProfileTabs from "./_components/ProfileTabs";

export default async function ProfilePage() {
  const query = `
    query User($userId: String!) {
    user(id: $userId) {
      email
      firstname
      lastname
      bet_selection_result {
        id
        point_p10
        point_dnf
        grand_prix {
          date
          season
          time
          track {
            track_name
            country_name
          }
        }
        grand_prix_pilote_p10 {
          pilote {
            name
            name_acronym
            pilote_ecurie {
              ecurie {
                name
              }
            }
          }
        }
        grand_prix_pilote_dnf {
          pilote {
            name
            name_acronym
            pilote_ecurie {
              ecurie {
                name
              }
            }
          }
        }
      }
    }
  }
  `;

  const userId = await retrieveUserId();
  console.log(userId);
  const variables = {
    userId: userId,
  };

  const result: UserResponse & GqlError = await callAPI<UserResponse>({
    query: query,
    variables: variables,
    token: await retrieveToken(),
  });

  return <ProfileTabs user={result.data.user} />;
}
