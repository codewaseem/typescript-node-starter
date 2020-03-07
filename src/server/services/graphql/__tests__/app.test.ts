import gql from "graphql-tag";
import { constructTestServer } from "./__helpers__";
import { createTestClient } from "apollo-server-testing";

describe("GraphQL Test", () => {
  test("it should respond with a success message", async () => {
    const { server } = constructTestServer();
    const { query } = createTestClient(server);
    const res = await query({
      query: gql`
        query {
          user {
            name
          }
        }
      `,
    });
    expect(res).toMatchSnapshot();
  });
});
