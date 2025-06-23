import Link from 'next/link'

interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  author: {
    username: string
  }
}

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN')
  }

  const getExcerpt = (content: string, length: number = 150) => {
    return content.length > length ? content.substring(0, length) + '...' : content
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <Link href={`/posts/${post.id}`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
          {post.title}
        </h2>
      </Link>
      
      <p className="text-gray-600 mb-4 line-clamp-3">
        {getExcerpt(post.content)}
      </p>
      
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>作者：{post.author.username}</span>
        <span>{formatDate(post.createdAt)}</span>
      </div>
      
      <div className="mt-4">
        <Link
          href={`/posts/${post.id}`}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          阅读更多 →
        </Link>
      </div>
    </div>
  )
}