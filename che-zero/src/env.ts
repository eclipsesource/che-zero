/********************************************************************************
 * Copyright (c) 2021 EclipseSource and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * https://www.eclipse.org/legal/epl-2.0, or the MIT License which is
 * available at https://opensource.org/licenses/MIT.
 *
 * SPDX-License-Identifier: EPL-2.0 OR MIT
 ********************************************************************************/
export const env = () => {
  console.log(process.env);
  const {
    REACT_APP_CHE_DOMAIN: CHE_DOMAIN = '192.168.99.100.nip.io',
  } = process.env;
  return {
    CHE_DOMAIN,
  };
};
