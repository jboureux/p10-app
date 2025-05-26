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
      bets_selection_results {
        point_p10
        grand_prix {
          date
          season
          time
          track {
            track_name
            country_name
          }
        }
        grand_prix_pilote {
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

  const variables = {
    userId: userId,
  };

  const result: UserResponse & GqlError = await callAPI<UserResponse>({
    query: query,
    variables: variables,
    token: await retrieveToken(),
  });

  console.log(result);

  return <ProfileTabs user={result.data.user} />;
}
