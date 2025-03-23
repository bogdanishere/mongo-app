import { User } from "@/models/user";
import { GetServerSideProps } from "next";
import * as UsersApi from "@/network/api/users";
import * as BlogApi from "@/network/api/blog";
import { useState } from "react";
import useAuthenticatedUser from "@/hooks/useAuthenticatedUser";
import Head from "next/head";
import { Col, Form, Row, Spinner } from "react-bootstrap";
import Image from "next/image";
import profilePicPlaceholder from "@/assets/images/profile-pic-placeholder.png";
import styles from "@/styles/ProfilePicturePage.module.css";
import { formatDate } from "@/utils/utils";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import FormInputField from "@/components/form/FormInputField";
import LoadingButton from "@/components/LoadingButton";
import useSWR from "swr";
import BlogPostsGrid from "@/components/BlogPostsGrid";

export const getServerSideProps: GetServerSideProps<
  UserProfilePageProps
> = async ({ params }) => {
  const username = params?.username?.toString();
  if (!username) throw Error("username missing");

  const user = await UsersApi.getUserByUsername(username);
  return {
    props: {
      user: await user,
    },
  };
};

interface UserProfilePageProps {
  user: User;
}

export default function UserProfilePage({ user }: UserProfilePageProps) {
  const { user: loggedInUser, mutateUser: mutateLoggedInUser } =
    useAuthenticatedUser();

  const [profileUser, setProfileUser] = useState(user);

  const profileUserIsLoggedInUser =
    (loggedInUser && loggedInUser._id === profileUser._id) || false;

  function handleUserUpdated(updatedUser: User) {
    console.log("updatedUser", updatedUser);
    mutateLoggedInUser(updatedUser);
    setProfileUser(updatedUser);
  }
  return (
    <>
      <Head>
        <title>{`${profileUser.username} - Flow Blog`}</title>
      </Head>

      <div>
        <UserInfoSection user={user} />
        {profileUserIsLoggedInUser && (
          <>
            <hr />
            <UpdateUserProfileSec onUserUpdated={handleUserUpdated} />
          </>
        )}
        <UserBlogPostsSection user={profileUser} />
      </div>
    </>
  );
}

interface UserInfoSectionProps {
  user: User;
}

function UserInfoSection({
  user: { username, displayName, profilePic, about, createdAt },
}: UserInfoSectionProps) {
  return (
    <Row>
      <Col sm="auto">
        <Image
          src={profilePic || profilePicPlaceholder}
          width={200}
          height={200}
          alt="Image"
          priority
          className={`rounded ${styles.profilePicture}`}
        />
      </Col>
      <Col className="mt-2 mt-sm-0">
        <h1>{displayName}</h1>
        <div>
          <strong>Username: </strong>
          {username}
        </div>
        <div>
          <strong>User since: </strong>
          {formatDate(createdAt)}
        </div>
        <div className="pre-line">
          <strong>About me: </strong>
          <br /> {about || "This user hasn't share any information yet."}
        </div>
      </Col>
    </Row>
  );
}

type UpdateUserProfileFormData = yup.InferType<typeof validationSchema>;

const validationSchema = yup.object({
  displayName: yup.string(),
  about: yup.string().max(200),
  profilePic: yup.mixed<FileList>(),
});

interface UpdateUserProfileSecProps {
  onUserUpdated: (updatedUser: User) => void;
}

function UpdateUserProfileSec({ onUserUpdated }: UpdateUserProfileSecProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateUserProfileFormData>();

  async function onSubmit({
    displayName,
    about,
    profilePic,
  }: UpdateUserProfileFormData) {
    if (!displayName && !about && (!profilePic || profilePic?.length === 0)) {
      return;
    }
    try {
      const updatedUser = await UsersApi.updateUser({
        displayName,
        about,
        profilePic: profilePic?.item(0) || undefined,
      });

      onUserUpdated(updatedUser);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <h2>Update Profile</h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormInputField
          register={register("displayName")}
          name="displayName"
          label="Display Name"
        />
        <FormInputField
          register={register("about")}
          name="about"
          label="About"
          as="textarea"
          maxLength={160}
        />
        <FormInputField
          register={register("profilePic")}
          name="profilePic"
          label="Profile Picture"
          type="file"
          accept="image/jpeg, image/png"
        />
        <LoadingButton type="submit" isLoading={isSubmitting}>
          Update Profile
        </LoadingButton>
      </Form>
    </div>
  );
}

interface UserBlogPostsSectionProps {
  user: User;
}

function UserBlogPostsSection({ user }: UserBlogPostsSectionProps) {
  const {
    data: blogPosts,
    isLoading: blogPostsLoading,
    error: blogPostsError,
  } = useSWR(user._id, BlogApi.getBlogPostsByUser);
  return (
    <div>
      <h2>Blog Posts</h2>
      <div className="f-flex flex-column align-items-center">
        {blogPostsLoading && <Spinner animation="border" />}
        {blogPostsError && <div>Error loading blog posts</div>}
        {blogPosts?.length === 0 && <div>No blog posts</div>}
        {blogPosts && <BlogPostsGrid posts={blogPosts} />}
      </div>
    </div>
  );
}
