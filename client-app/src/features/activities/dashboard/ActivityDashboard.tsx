import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Grid, Loader } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import ActivityList from "./ActivityList";
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroll-component";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

function ActivityDashboard() {
  const { activityStore } = useStore();
  const { loadActivities, activityRegistry, setPagingParams, pagination } =
    activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  function handleGetNext() {
    setLoadingNext(true);
    setPagingParams(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
  }

  useEffect(() => {
    if (activityRegistry.size <= 1) loadActivities();
  }, [activityRegistry.size, loadActivities]);

  return (
    <Grid>
      <Grid.Column width="10">
        {activityStore.loadingInitial && !loadingNext ? (
          <>
            <ActivityListItemPlaceholder />
            <ActivityListItemPlaceholder />
          </>
        ) : (
          <InfiniteScroll
            loader={<h4>Loading...</h4>}
            dataLength={pagination?.totalPages ?? 0 * 10}
            next={handleGetNext}
            hasMore={
              !loadingNext &&
              !!pagination &&
              pagination.currentPage < pagination.totalPages
            }
          >
            <ActivityList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={loadingNext} />
      </Grid.Column>
    </Grid>
  );
}

export default observer(ActivityDashboard);
