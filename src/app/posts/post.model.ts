/* we create our own post type
export it so that our app can use it,
interface, class are blueprints!
*/

export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
}
