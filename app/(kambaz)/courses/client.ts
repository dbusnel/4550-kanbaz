import axios from "axios";
const axiosWithCredentials = axios.create({ withCredentials: true });
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
const COURSES_API = `${HTTP_SERVER}/api/courses`;
const USERS_API = `${HTTP_SERVER}/api/users`;
const MODULES_API = `${HTTP_SERVER}/api/modules`;

export const deleteModule = async (moduleId: string) => {
  const response = await axios.delete(`${MODULES_API}/${moduleId}`);
  return response.data;
};

export const fetchAllCourses = async () => {
  const { data } = await axios.get(COURSES_API);
  return data;
};

export const findMyCourses = async () => {
  const { data } = await axiosWithCredentials.get(
    `${USERS_API}/current/courses`,
  );
  return data;
};

export const createCourse = async (course: any) => {
  const { data } = await axiosWithCredentials.post(
    `${USERS_API}/current/courses`,
    course,
  );
  return data;
};

export const deleteCourse = async (id: string) => {
  const { data } = await axios.delete(`${COURSES_API}/${id}`);
  return data;
};

export const updateCourse = async (course: any) => {
  const { data } = await axios.put(`${COURSES_API}/${course._id}`, course);
  return data;
};

export const findModulesForCourse = async (courseId: string) => {
  const response = await axios.get(`${COURSES_API}/${courseId}/modules`);
  return response.data;
};

export const createModuleForCourse = async (courseId: string, module: any) => {
  const response = await axios.post(
    `${COURSES_API}/${courseId}/modules`,
    module,
  );
  return response.data;
};

export const updateModule = async (module: any) => {
  const { data } = await axios.put(`${MODULES_API}/${module._id}`, module);
  return data;
};

const ASSIGNMENTS_API = `${HTTP_SERVER}/api/assignments`;

export const findAssignmentsForCourse = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/assignments`);
  return data;
};

export const createAssignmentForCourse = async (
  courseId: string,
  assignment: any,
) => {
  const { data } = await axios.post(
    `${COURSES_API}/${courseId}/assignments`,
    assignment,
  );
  return data;
};

export const updateAssignment = async (assignment: any) => {
  const { data } = await axios.put(
    `${ASSIGNMENTS_API}/${assignment._id}`,
    assignment,
  );
  return data;
};

export const deleteAssignment = async (assignmentId: string) => {
  const { data } = await axios.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
  return data;
};

export const enrollUserInCourse = async (userId: string, courseId: string) => {
  const { data } = await axios.post(
    `${USERS_API}/${userId}/courses/${courseId}/enroll`,
  );
  return data;
};

export const unenrollUserInCourse = async (
  userId: string,
  courseId: string,
) => {
  const { data } = await axios.post(
    `${USERS_API}/${userId}/courses/${courseId}/unenroll`,
  );
  return data;
};

export const getAllPazzaPosts = async (courseId: string, userId: string) => {
  console.log(USERS_API + `/${userId}/courses/${courseId}/pazza`);
  const { data } = await axios.get(
    USERS_API + `/${userId}/courses/${courseId}/pazza`,
  );
  return data;
};

export const getPostById = async (
  courseId: string,
  userId: string,
  postId: string,
) => {
  const { data } = await axios.get(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}`,
  );
  return data;
};

export const getUserById = async (userId: string) => {
  const { data } = await axios.get(USERS_API + `/${userId}`);
  return data;
};

export const setDiscussionResolved = async (
  courseId: string,
  userId: string,
  postId: string,
  discussionId: string,
  resolved: boolean,
) => {
  const { data } = await axios.patch(
    USERS_API +
      `/${userId}/courses/${courseId}/pazza/${postId}/discussions/${discussionId}`,
    { resolved },
  );
  return data;
};

export const addFollowUpDiscussion = async (
  courseId: string,
  userId: string,
  postId: string,
  content: string,
) => {
  const { data } = await axios.post(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}/discussions`,
    { content },
  );
  return data;
};

export const addReplyToDiscussion = async (
  courseId: string,
  userId: string,
  postId: string,
  discussionId: string,
  content: string,
) => {
  const { data } = await axios.post(
    USERS_API +
      `/${userId}/courses/${courseId}/pazza/${postId}/discussions/${discussionId}/replies`,
    { content },
  );
  return data;
};

export const getCourseUsers = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/users`);
  return data;
};

export const getPazzaFolders = async (courseId: string) => {
  const { data } = await axios.get(`${COURSES_API}/${courseId}/pazza/folders`);
  return data;
};

export const createPazzaFolder = async (courseId: string, name: string) => {
  const { data } = await axios.post(`${COURSES_API}/${courseId}/pazza/folders`, { name });
  return data;
};

export const updatePazzaFolder = async (courseId: string, folderId: string, name: string) => {
  const { data } = await axios.put(`${COURSES_API}/${courseId}/pazza/folders/${folderId}`, { name });
  return data;
};

export const deletePazzaFolder = async (courseId: string, folderId: string) => {
  await axios.delete(`${COURSES_API}/${courseId}/pazza/folders/${folderId}`);
};

export const updatePazzaPost = async (courseId: string, userId: string, postId: string, updates: { summary?: string; details?: string }) => {
  const { data } = await axios.put(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}`,
    updates,
  );
  return data;
};

export const deletePazzaPostById = async (courseId: string, userId: string, postId: string) => {
  await axios.delete(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}`,
  );
};

export const incrementPazzaViewCount = async (courseId: string, userId: string, postId: string) => {
  const { data } = await axios.post(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}/view`,
  );
  return data as { viewCount: number };
};

export const updateFollowUpDiscussion = async (courseId: string, userId: string, postId: string, discussionId: string, content: string) => {
  const { data } = await axios.put(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}/discussions/${discussionId}`,
    { content },
  );
  return data;
};

export const deleteFollowUpDiscussion = async (courseId: string, userId: string, postId: string, discussionId: string) => {
  await axios.delete(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}/discussions/${discussionId}`,
  );
};

export const updateReply = async (courseId: string, userId: string, postId: string, discussionId: string, replyId: string, content: string) => {
  const { data } = await axios.put(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}/discussions/${discussionId}/replies/${replyId}`,
    { content },
  );
  return data;
};

export const deleteReply = async (courseId: string, userId: string, postId: string, discussionId: string, replyId: string) => {
  await axios.delete(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}/discussions/${discussionId}/replies/${replyId}`,
  );
};

export const createStudentAnswer = async (courseId: string, userId: string, postId: string, content: string) => {
  const { data } = await axios.post(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}/student-answers`,
    { content },
  );
  return data;
};

export const updateStudentAnswer = async (courseId: string, userId: string, postId: string, answerId: string, content: string) => {
  const { data } = await axios.put(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}/student-answers/${answerId}`,
    { content },
  );
  return data;
};

export const deleteStudentAnswer = async (courseId: string, userId: string, postId: string, answerId: string) => {
  await axios.delete(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}/student-answers/${answerId}`,
  );
};

export const createInstructorAnswer = async (courseId: string, userId: string, postId: string, content: string) => {
  const { data } = await axios.post(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}/instructor-answers`,
    { content },
  );
  return data;
};

export const updateInstructorAnswer = async (courseId: string, userId: string, postId: string, answerId: string, content: string) => {
  const { data } = await axios.put(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}/instructor-answers/${answerId}`,
    { content },
  );
  return data;
};

export const deleteInstructorAnswer = async (courseId: string, userId: string, postId: string, answerId: string) => {
  await axios.delete(
    USERS_API + `/${userId}/courses/${courseId}/pazza/${postId}/instructor-answers/${answerId}`,
  );
};

export const createPazzaPost = async (
  courseId: string,
  userId: string,
  post: { summary: string; type: string; details: string; folderIds?: string[]; visibility?: string; visibleTo?: string[] },
) => {
  const { data } = await axios.post(
    USERS_API + `/${userId}/courses/${courseId}/pazza`,
    post,
  );
  return data;
};
