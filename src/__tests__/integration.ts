import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import server from "../server";

describe("Resolvers", () => {
  let query;
  beforeEach(() => {
    const { query: q } = createTestClient(server);
    query = q;
  });
  it("should persists across aliased resolvers", async () => {
    const res = await query({
      query: SIMPLE_QUERY
    });
    expect(res.data.dataSourceTest1).toEqual(res.data.dataSourceTest2);
  });
  it("should persists across different resolvers", async () => {
    const res = await query({
      query: gql`
        query MultipleDataSources {
          dataSourceTest
          books {
            id
            title
          }
        }
      `
    });
    expect(res.data.dataSourceTest).toEqual(res.data.books[0].id);
  });
});

describe("Requests", () => {
  let query;
  beforeEach(() => {
    const { query: q } = createTestClient(server);
    query = q;
  });
  it("should NOT persists across different requests", async () => {
    const [res1, res2] = await Promise.all([
      query({
        query: SIMPLE_QUERY
      }),
      query({
        query: SIMPLE_QUERY
      })
    ]);
    expect(res1.data.dataSourceTest1).toEqual(res1.data.dataSourceTest2);
    expect(res2.data.dataSourceTest1).toEqual(res2.data.dataSourceTest2);

    expect(res1.data.dataSourceTest1).not.toEqual(res2.data.dataSourceTest1);
  });
});

const SIMPLE_QUERY = gql`
  query MultipleDataSources {
    dataSourceTest1: dataSourceTest
    dataSourceTest2: dataSourceTest
  }
`;
