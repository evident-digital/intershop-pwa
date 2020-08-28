import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import { QuotingHelper } from '../../models/quoting/quoting.helper';
import { QuotingEntity } from '../../models/quoting/quoting.model';

import {
  loadQuoting,
  loadQuotingDetail,
  loadQuotingDetailSuccess,
  loadQuotingFail,
  loadQuotingSuccess,
} from './quoting.actions';

export const quotingAdapter = createEntityAdapter<QuotingEntity>({
  sortComparer: QuotingHelper.sort,
});

export interface QuotingState extends EntityState<QuotingEntity> {
  loading: number;
  error: HttpError;
}

const initialState: QuotingState = quotingAdapter.getInitialState({
  loading: 0,
  error: undefined,
});

export const quotingReducer = createReducer(
  initialState,
  setLoadingOn(loadQuoting, loadQuotingDetail),
  unsetLoadingAndErrorOn(loadQuotingSuccess, loadQuotingDetailSuccess),
  setErrorOn(loadQuotingFail),
  on(loadQuotingSuccess, (state, action) => quotingAdapter.upsertMany(action.payload.quoting, state)),
  on(loadQuotingDetailSuccess, (state, action) => quotingAdapter.upsertOne(action.payload.quote, state))
);
