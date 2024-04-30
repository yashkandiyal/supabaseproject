import { useState } from "react";
import "./App.css";
import { supabase } from "./supabaseBackend/createClient";
import { useMutation, useQuery, useQueryClient } from "react-query";

const App = () => {
  const queryClient = useQueryClient();
  const [inputName, setInputName] = useState<string>("");
  const [inputAge, setInputAge] = useState<number>();
  const [nameToDelete, setNametoDelete] = useState<string>("");
  const [ageToDelete, setAgetoDelete] = useState<number>();
  const [show, setShow] = useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<number>();
  const fetchUsers = async () => {
    try {
      let { data } = await supabase.from("users").select("*");
      return data;
    } catch (error) {
      console.log("error:", error);
    }
  };
  const postUsersData = async () => {
    try {
      const { data } = await supabase
        .from("users")
        .insert([{ name: inputName, age: inputAge }])
        .select();
      return data;
    } catch (error) {}
  };
  const deleteUserData = async () => {
    try {
      return await supabase.from("users").delete().eq("id", idToDelete);
    } catch (error) {}
  };
  const {
    data: allUsers,
    isSuccess,
    isLoading,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
  const postingUserData = useMutation(postUsersData, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("users");
      return setShow(false);
    },
    onError: (e) => {
      console.log(e);
    },
  });
  const deletingUserData = useMutation(deleteUserData, {
    onSuccess: () => {
      queryClient.invalidateQueries("users");
      return setShow(false);
    },
    onError: (e) => {
      console.log(e);
    },
  });
  return (
    <>
      <div className="flex flex-col items-center w-full mt-10">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => setInputName(e.target.value)}
            className="px-4 py-2 w-64 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
          />
          <input
            type="number"
            placeholder="Age"
            onChange={(e: any) => setInputAge(e.target.value)}
            className="px-4 py-2 w-24 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
          />
          <button
            onClick={() => postingUserData.mutate()}
            className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
            Add
          </button>
        </div>
        {show && (
          <div>
            <div className="flex items-center space-x-4 mt-5">
              <input
                type="text"
                placeholder="Name"
                value={nameToDelete}
                className="px-4 py-2 w-64 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
              />
              <input
                type="number"
                id="age"
                placeholder="Age"
                value={ageToDelete}
                className="px-4 py-2 w-24 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:outline-none"
              />
              <button
                className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                onClick={() => {
                  deletingUserData.mutate();
                }}>
                Remove row
              </button>
            </div>
          </div>
        )}

        <div className="flex  items-center mt-10">
          <div className="bg-white shadow-md rounded-lg w-96">
            {isLoading && (
              <div className="text-2xl text-center text-gray-600 py-8">
                Loading...
              </div>
            )}
            {!isLoading && isSuccess && (
              <>
                <h1 className="text-xl font-semibold text-center p-4">Users</h1>
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          placeholder="-"
                          className="px-6 py-3"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allUsers?.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            name=""
                            id=""
                            placeholder="-"
                            onClick={() => {
                              setShow((prev) => !prev);
                              setAgetoDelete(user.age);
                              setNametoDelete(user.name);
                              setIdToDelete(user.id);
                            }}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.age}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
            {isSuccess && allUsers?.length === 0 && (
              <div className="text-center text-gray-600 py-8">
                No users found.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
