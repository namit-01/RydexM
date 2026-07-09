// import { auth } from "@/auth";
// import AdminDashboard from "@/components/AdminDashboard";
// import Footer from "@/components/Footer";
// import GeoUpdater from "@/components/GeoUpdater";

// import Nav from "@/components/Nav";
// import PartnerDashboard from "@/components/PartnerDashboard";
// import PublicHome from "@/components/PublicHome";
// import connectDb from "@/lib/db";
// import User from "@/models/user.model";

// export default async function Home() {
//   const session = await auth();

//   await connectDb();

//   let user = null;

//   if (session?.user?.email) {
//     user = await User.findOne({ email: session.user.email });
//   }

//   const plainUser = user ? JSON.parse(JSON.stringify(user)) : null;
//   return (
//     <div className="w-full min-h-screen bg-white">
//       {plainUser && <GeoUpdater userId={String(plainUser._id)} />}
//       {plainUser?.role == "partner" ? (
//         <>
//           <Nav />
//           <PartnerDashboard />
//         </>
//       ) : plainUser?.role == "admin" ? (
//         <AdminDashboard />
//       ) : (
//         <>
//           <Nav />
//           <PublicHome />
//         </>
//       )}

//       <Footer />
//     </div>
//   );
// }
export default function Home() {
  return <h1>Hello</h1>;
}
