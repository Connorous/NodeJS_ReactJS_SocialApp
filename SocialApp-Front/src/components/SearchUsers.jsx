import { useState, useEffect } from "react";
import SearchUserResultPlaceHolder from "./SearchUserResultPlaceHolder";
import uuid from "react-uuid";

function SearchUsers({
  user,
  token,
  setProfileUser,
  refreshSentFriendRequests,
}) {
  var [searchValue, setSearchValue] = useState("");
  var [searchResults, setSearchResults] = useState(null);
  var [error, setError] = useState(null);

  var schVal = searchValue;

  function uuidFromUuidV4() {
    const newUuid = uuid();
    return newUuid;
  }

  async function searchUsers() {
    if (searchValue !== "") {
      const settings = {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          search: searchValue,
          user: user,
        }),
      };
      try {
        const url = "http://localhost:3063/users/search";
        const fetchSearchUsers = await fetch(url, settings);
        const data = await fetchSearchUsers.json();

        if (data.success === true) {
          console.log(data.searchResults);
          setSearchResults(data.searchResults);
        } else {
          setError(data.msg);
        }
      } catch (e) {
        return e;
      }
    }
  }

  useEffect(() => {
    if (searchValue !== "" && searchValue.length >= 3) {
      searchUsers();
    }
  }, [searchValue]);

  function refreshSearch() {
    searchUsers();
  }

  return (
    <div className="search-users">
      <h2>Search People</h2>
      <p>{error}</p>
      <input
        name="search"
        value={schVal}
        placeholder="Search"
        onChange={(e) => setSearchValue(e.target.value)}
      ></input>
      {searchResults !== null ? (
        <>
          {searchResults.length > 0 ? (
            <div className="user-search">
              <p className="search-results">
                Search Results: ({searchResults.length})
              </p>
              {searchResults.map((searchedUser) => (
                <div
                  key={uuidFromUuidV4()}
                  id={searchedUser.id}
                >
                  <SearchUserResultPlaceHolder
                    key={uuidFromUuidV4()}
                    searchedUser={searchedUser}
                    user={user}
                    token={token}
                    setProfileUser={setProfileUser}
                    refreshSentFriendRequests={refreshSentFriendRequests}
                    refreshSearch={refreshSearch}
                  ></SearchUserResultPlaceHolder>
                  <br></br>
                </div>
              ))}
              <br></br>
              <br></br>
              <br></br>
            </div>
          ) : (
            <>
              <p>No results for the username provided.</p>
            </>
          )}
        </>
      ) : (
        <></>
      )}
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
    </div>
  );
}

export default SearchUsers;
