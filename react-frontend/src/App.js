import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// import BlogPage, { loader as postsLoader } from './pages/Blog';
import HomePage from './pages/Home';
// import PostPage, { loader as postLoader } from './pages/Post';
import RootLayout from './pages/Root';
//Suspense is basically a component provided by react that can be used by other things, other components to wait for content to be loaded before actually rendering the content. And here Suspense is used to wrap it around this lazy loaded component so that we can show a fallback which is specified with the help of the fallback prop on suspense
import { lazy, Suspense } from 'react';

//for this function to work as a component function it should return jsx, but this function yields a promise so for this function to work as a component function we need to wrapped with the lazy function which is imported from React
const BlogPage = lazy(() => import('./pages/Blog'));
const PostPage = lazy(() => import('./pages/Post'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'posts',
        children: [
          // { index: true, element: <BlogPage />, loader: postsLoader },
          {
            index: true,
            element: (
              <Suspense fallback={<p>Loading....</p>}>
                <BlogPage />
              </Suspense>
            ),
            loader: () =>
              import('./pages/Blog').then((module) => module.loader()),
          },
          // { path: ':id', element: <PostPage />, loader: postLoader },
          {
            path: ':id',
            element: (
              <Suspense>
                <PostPage fallback={<p>Loading....</p>} />
              </Suspense>
            ),
            loader: (meta) =>
              import('./pages/Post').then((module) => module.loader(meta)),
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
