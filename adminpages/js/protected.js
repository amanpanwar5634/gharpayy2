function loadDashboard() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/admin";
    return;
  }

  fetch("/dashboard", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Unauthorized");
      return response.text();
    })
    .then((html) => {
      window.location.href = "/dashboard";
      document.open();
      document.write(html);
      document.close();
    })
    .catch(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/admin";
    });
}

function loadProtectedPage(page) {

  const token = localStorage.getItem("token");


  if (!token) {
    console.log("No token found, redirecting to login page.");
    window.location.href = "/admin";
    return;
  }

  fetch(`https://gharpayy-backend.vercel.app/${page}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) {

        throw new Error("Unauthorized");
      }
      console.log("Page fetched successfully.");
      return response.text();
    })
    .then((html) => {

      document.open();
      document.write(html);
      document.close();
    })
    .catch((error) => {
      console.error("Error during fetch:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      console.log("Token removed, redirecting to login.");
      window.location.href = "/admin";
    });
}


function loadEnquiries() {
  const token = localStorage.getItem("token");

  if (!token) {
  
    window.location.href = "/admin";
    return;
  }

  fetch("/enquirypage", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => {
      if (!response.ok) throw new Error("Unauthorized");
      return response.text();
    })
    .then((html) => {
      
      document.open();
      document.write(html);
      document.close();
    })
    .catch(() => {
      localStorage.removeItem("token");
      console.log("issue2");
      window.location.href = "/admin";
    });
}