import { useEffect, useState } from "react";
import Title from "../utils/Title";
import User from "../../types/User";
import axios from "axios";
import AddUser from "./Add";
import DetailUser from "./Detail";
import Loading from "../utils/Loading";
import classNames from "classnames";

const AllUser: React.FC = () => {
  const token = localStorage.getItem("token");
  const [users, setUsers] = useState<User[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addUser, setAddUser] = useState<boolean>(false);
  const [updateUser, setUpdateUser] = useState<string>("");

  async function getUsers() {
    setIsLoading(true);
    const response = await axios.get(`http://localhost:5000/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setUsers(response.data);
    setTimeout(() => {
      if (response.status == 200) setIsLoading(false);
    }, 500);
  }

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <Title
        button={{
          name: "Tambah Pengguna",
          onClick: () => setAddUser(!addUser),
        }}
      >
        Pengguna
      </Title>
      <div className="relative overflow-x-auto mt-8">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs uppercase text-gray-400 border-b border-cod-gray-900 bg-cod-gray-900">
            <tr>
              <th scope="col" className="px-6 py-3">
                No
              </th>
              <th scope="col" className="px-6 py-3">
                Nama Lengkap
              </th>
              <th scope="col" className="px-6 py-3">
                Nama Pengguna
              </th>
              <th scope="col" className="px-6 py-3">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.length > 0 &&
              users.map((user, index) => (
                <tr
                  key={index}
                  className={classNames("border-cod-gray-900 text-white", {
                    "border-b": index + 1 < users.length,
                  })}
                >
                  <td className="px-6 py-4">{index + 1}</td>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium  whitespace-nowrap"
                  >
                    {user.fullname}
                  </th>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">
                    <button
                      id={user._id}
                      className="btn bg-cod-gray-800 hover:bg-cod-gray-900 text-white px-3 py-2 rounded cursor-pointer"
                      onClick={() => setUpdateUser(user._id)}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {updateUser != "" && (
        <DetailUser
          id={updateUser}
          onClose={() => setUpdateUser("")}
          onSuccess={() => getUsers()}
        />
      )}
      {addUser && (
        <AddUser
          onClose={() => setAddUser(!addUser)}
          onSuccess={() => getUsers()}
        />
      )}
    </>
  );
};

export default AllUser;
