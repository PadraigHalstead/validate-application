import React, { useState, useEffect } from 'react';
import { AdminList } from './AdminList';
import { AddAdminForm } from './form/AddAdmin';
import { ValidList } from './ValidList';

export const AdminUserAdminPanel = () => {
  return (
    <>
      <AddAdminForm />
      <h3>Administrators</h3>
      <AdminList />
      <h3>Validated Students</h3>
      <ValidList />
    </>
  );
};
