import { createSelector } from '@ngrx/store';

import { getCustomerState } from 'ish-core/store/customer/customer-store';
import { getLoggedInUser } from 'ish-core/store/customer/user';

import { addressAdapter } from './addresses.reducer';

const getAddressesState = createSelector(getCustomerState, state => state.addresses);

export const { selectAll: getAllAddresses } = addressAdapter.getSelectors(getAddressesState);

export const getAddressesLoading = createSelector(getAddressesState, addresses => addresses.loading);

export const getAddressesError = createSelector(getAddressesState, addresses => addresses.error);

export const getPreferredShipToAddress = createSelector(getLoggedInUser, getAllAddresses, (user, addresses) =>
  addresses?.find(a => a.urn === user.preferredShipToAddressUrn)
);
