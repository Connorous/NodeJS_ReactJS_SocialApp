function BlockedContactPlaceHolder({
  user,
  token,
  blockedUser,
  refreshFriends,
  refreshBlockedContacts,
}) {
  async function unBlock() {
    const settings = {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: user,
        blockedUser: blockedUser,
      }),
    };
    try {
      const url = "http://localhost:3063/friend/unblock";
      const unBlockUser = await fetch(url, settings);
      var data = await unBlockUser.json();
      if (data.success === true) {
        refreshFriends();
        refreshBlockedContacts();
      } else {
        setError(data.msg);
      }
    } catch (e) {
      return console.log(e);
    }
  }

  return (
    <div className="blockedcontact">
      <p>{blockedUser.username}</p>
      <div>
        <button onClick={() => unBlock()}>Unblock</button>
      </div>
      <br></br>
    </div>
  );
}

export default BlockedContactPlaceHolder;
