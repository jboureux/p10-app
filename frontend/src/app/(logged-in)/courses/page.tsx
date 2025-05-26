import { callAPI } from "@/lib/api-client";
import { retrieveToken } from "@/lib/auth-server";
import { GqlError } from "@/types/errors";
import { AllGrandPrixResponse } from "@/types/grandprix";
import CoursesPage from "./_components/CoursesPage";

const Courses = async () => {
  const query = `
  query AllGrandPrix {
    allGrandPrix {
      date
      id_api_races
      season
      time
      grand_prix_classement {
        position
        grand_prix_pilote {
          ecurie {
            name
          }
          pilote {
            name
            name_acronym
          }
        }
        is_dnf
        is_first_dnf
      }
      track {
        country_name
        id_api_track
        track_name
        picture_country
        picture_track
      }
    }
  }
  `;

  const result: AllGrandPrixResponse & GqlError =
    await callAPI<AllGrandPrixResponse>({
      query: query,
      token: await retrieveToken(),
    });

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return <CoursesPage grandPrixList={result.data.allGrandPrix} />;
};

export default Courses;
