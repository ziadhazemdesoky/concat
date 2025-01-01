// node_nodules
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
// utils
import { fetchUser, getHouseholdsAdmin } from "../../utils/api";
// types
import { iHousehold, iUser } from "../../utils/types";

const Household: React.FC = () => {
  const [user, setUser] = useState<{
    email: string;
    phone: string;
    name: string;
  } | null>(null);
  const [households, setHouseholds] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      const user = await fetchUser();
      setUser(user);
    };

    const getHouseholds = async () => {
      const households = await getHouseholdsAdmin();
      setHouseholds(households);
    };

    getUser();
    getHouseholds();
  }, []);

  const userStatus = (household: iHousehold, user: iUser) => {
    if (user) {
      if (user.userNotExist) {
        return (
          <div className={`${user.status === "PENDING" && "text-[#7B24A4]"}`}>
            {String(user.status).charAt(0) +
              String(user.status).slice(1).toLowerCase()}
          </div>
        );
      } else {
        if (
          household?.primary_user?.status === "NEW" ||
          household?.primary_user?.status === "ACTIVE"
        ) {
          return <div className="text-[#10A840]">Active</div>;
        } else {
          return <div className="text-[#F86707]">Inactive</div>;
        }
      }
    } else {
      return "";
    }
  };

  return (
    <div className="bg-gray-200 p-8 min-h-screen">
      <div>
        <h1 className="text-3xl mb-10 font-bold">
          Admin Dashboard - {user ? user.name : ""}
        </h1>

        <div className="col-span-full flex justify-between">
          <div className="bg-white rounded-lg p-6 mr-6 w-2/3">
            <h2 className="text-2xl font-bold mb-4 text-[#4338ca]">
              Households
            </h2>

            <div>
              {households.length &&
                households.map((household: iHousehold) => (
                  <div className="mb-5" key={household.id}>
                    <table className="border-collapse w-full">
                      <thead>
                        <tr className="border border-solid border-gray-300 text-left">
                          <th colSpan={4} className="text-2xl px-5 py-3">
                            {household.label}
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        <tr className="border border-solid border-gray-300 ">
                          <td className="w-1/4 px-5 py-3">
                            <div className="text-xl min-h-8">
                              {household?.primary_user?.userNotExist
                                ? `${household?.primary_user?.first_name} ${household?.primary_user?.last_name}`
                                : household?.primary_user?.name}
                            </div>

                            <div className="flex">
                              <div className="mr-1">Primary</div>

                              <div>
                                {household?.primary_user?.updatedAt &&
                                  format(
                                    household.primary_user.updatedAt,
                                    "MM/dd/yy"
                                  )}
                              </div>
                            </div>
                          </td>

                          <td className="w-1/4 px-5 py-3">
                            {userStatus(household, household?.primary_user)}
                          </td>

                          <td className="w-1/4 px-5 py-3">
                            <button className="underline">
                              Reset Password
                            </button>
                          </td>

                          <td className="w-1/4 px-5 py-3">
                            <button className="underline">Deactivate</button>
                          </td>
                        </tr>

                        <tr className="border border-solid border-gray-300 ">
                          <td className="w-1/4 px-5 py-3">
                            <div className="text-xl min-h-8">
                              {household?.partner_user?.userNotExist
                                ? `${household?.partner_user?.first_name} ${household?.partner_user?.last_name}`
                                : household?.partner_user?.name}
                            </div>

                            <div className="flex">
                              <div className="mr-1">Partner</div>

                              <div>
                                {household?.partner_user?.updatedAt &&
                                  format(
                                    household.partner_user.updatedAt,
                                    "MM/dd/yy"
                                  )}
                              </div>
                            </div>
                          </td>

                          <td className="w-1/4 px-5 py-3">
                            {userStatus(household, household?.partner_user)}
                          </td>

                          <td className="w-1/4 px-5 py-3">
                            <button className="underline">
                              Reset Password
                            </button>
                          </td>

                          <td className="w-1/4 px-5 py-3">
                            <button className="underline">Deactivate</button>
                          </td>
                        </tr>

                        <tr className="border border-solid border-gray-300 ">
                          <td className="w-1/4 px-5 py-3">
                            <div className="text-xl min-h-8">
                              {household?.finance_user?.userNotExist
                                ? `${household?.finance_user?.first_name} ${household?.finance_user?.last_name}`
                                : household?.finance_user?.name}
                            </div>

                            <div className="flex">
                              <div className="mr-1">Finance</div>

                              <div>
                                {household?.finance_user?.updatedAt &&
                                  format(
                                    household.finance_user.updatedAt,
                                    "MM/dd/yy"
                                  )}
                              </div>
                            </div>
                          </td>

                          <td className="w-1/4 px-5 py-3">
                            {userStatus(household, household?.finance_user)}
                          </td>

                          <td className="w-1/4 px-5 py-3">
                            <button className="underline">
                              Reset Password
                            </button>
                          </td>

                          <td className="w-1/4 px-5 py-3">
                            <button className="underline">Deactivate</button>
                          </td>
                        </tr>
                      </tbody>

                      <tfoot>
                        <tr className="border border-solid border-gray-300 ">
                          <td className="w-1/4 px-5 py-5">
                            Total Transactions Uploaded:
                          </td>

                          <td className="w-1/4 px-5 py-5">
                            {household.totalTransactions}
                          </td>

                          <td className="w-1/4 px-5 py-5"></td>

                          <td className="w-1/4 px-5 py-5"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 ml-6 w-1/3 h-96"></div>
        </div>
      </div>
    </div>
  );
};

export default Household;
