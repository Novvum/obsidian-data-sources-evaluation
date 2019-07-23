import { createTestClient } from "apollo-server-testing";
import gql from "graphql-tag";
import server from "../server";

describe("DataSources", () => {
  let query;
  const SIMPLE_QUERY = gql`
    query DataSources {
      dataSourceTest1: dataSourceTest
      dataSourceTest2: dataSourceTest
    }
  `;
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

describe("DataLoaders", () => {
  let query;
  const SIMPLE_QUERY = gql`
    query DataLoaders {
      dataLoaderTest1: dataLoaderTest
      dataLoaderTest2: dataLoaderTest
    }
  `;
  beforeEach(() => {
    const { query: q } = createTestClient(server);
    query = q;
  });
  it("should persists across aliased resolvers", async () => {
    const res = await query({
      query: SIMPLE_QUERY
    });
    expect(res.data.dataLoaderTest1).toEqual(res.data.dataLoaderTest2);
  });
  it("should persists across different resolvers", async () => {
    const res = await query({
      query: gql`
        query MultipleDataSources {
          dataLoaderTest
          books {
            dlId
          }
        }
      `
    });
    expect(res.data.dataLoaderTest).toEqual(res.data.books[0].dlId);
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
    expect(res1.data.dataLoaderTest1).toEqual(res1.data.dataLoaderTest2);
    expect(res2.data.dataLoaderTest1).toEqual(res2.data.dataLoaderTest2);

    expect(res1.data.dataLoaderTest1).not.toEqual(res2.data.dataLoaderTest1);
  });
});
