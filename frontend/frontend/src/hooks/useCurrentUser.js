// import { useEffect, useState } from "react";

// export default function useCurrentUser() {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("http://localhost:8000/api/current-user/", {
//       credentials: "include",
//     })
//       .then(res => {
//         if (!res.ok) throw new Error("Not authenticated");
//         return res.json();
//       })
//       .then(data => setUser(data))
//       .catch(() => setUser(null))
//       .finally(() => setLoading(false));
//   }, []);

//   return { user, loading };
// }
