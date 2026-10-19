import { Button, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import config from '~/config';

export const BlogCard = ({ blog, onView, onEdit, onDelete }) => {
    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:transform hover:-translate-y-1 flex flex-col h-full">
            <div
                className="cursor-pointer flex-1 flex flex-col"
                onClick={() => onView && onView(blog)}
            >
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={config.imageConfig.getImage(blog.thumbnail) || config.webConfig.banner1}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-orange-700 p-1 rounded-lg w-fit bg-orange-200 text-sm">{config.webConfig.convertDateNoTime(blog.createdAt)}</p>
                    </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                    <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 mb-2">{blog.title}</h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">{blog.metaDescription}</p>
                    <p className="text-gray-500 text-xs mt-auto">Tác giả: {blog.user.username}</p>
                </div>
            </div>
            <div className="flex justify-between p-3 border-t border-gray-100">
                <Tooltip title="Xem chi tiết">
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        size="small"
                        className="text-blue-500 hover:text-blue-600"
                        onClick={() => onView && onView(blog)}
                    >
                        Xem
                    </Button>
                </Tooltip>
                <div>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            size="small"
                            className="text-green-500 hover:text-green-600 mr-1"
                            onClick={() => onEdit && onEdit(blog)}
                        />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            size="small"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => onDelete && onDelete(blog)}
                        />
                    </Tooltip>
                </div>
            </div>
        </div>);
};