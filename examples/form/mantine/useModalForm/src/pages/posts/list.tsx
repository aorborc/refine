import React from "react";
import { useTable, ColumnDef, flexRender } from "@pankod/refine-react-table";
import {
    Box,
    Group,
    List,
    ScrollArea,
    Table,
    Pagination,
    EditButton,
    DeleteButton,
    useModalForm,
    Select,
    DateField,
} from "@pankod/refine-mantine";

import { CreatePostModal, EditPostModal } from "../../components";
import { ColumnFilter, ColumnSorter } from "../../components/table";
import { FilterElementProps, IPost } from "../../interfaces";

export const PostList: React.FC = () => {
    const initialValues = {
        title: "",
        status: "",
        category: {
            id: "",
        },
        content: "",
    };

    const createModalForm = useModalForm({
        refineCoreProps: { action: "create" },
        initialValues,
        validate: {
            title: (value) => (value.length < 2 ? "Too short title" : null),
            status: (value) =>
                value.length <= 0 ? "Status is required" : null,
            category: {
                id: (value) =>
                    value.length <= 0 ? "Category is required" : null,
            },
            content: (value) =>
                value.length < 10 ? "Too short content" : null,
        },
    });
    const {
        modal: { show: showCreateModal },
    } = createModalForm;

    const editModalForm = useModalForm({
        refineCoreProps: { action: "edit" },
        initialValues,
        validate: {
            title: (value) => (value.length < 2 ? "Too short title" : null),
            status: (value) =>
                value.length <= 0 ? "Status is required" : null,
            category: {
                id: (value) =>
                    value.length <= 0 ? "Category is required" : null,
            },
            content: (value) =>
                value.length < 10 ? "Too short content" : null,
        },
    });
    const {
        modal: { show: showEditModal },
    } = editModalForm;

    const columns = React.useMemo<ColumnDef<IPost>[]>(
        () => [
            {
                id: "id",
                header: "ID",
                accessorKey: "id",
            },
            {
                id: "title",
                header: "Title",
                accessorKey: "title",
                meta: {
                    filterOperator: "contains",
                },
            },
            {
                id: "status",
                header: "Status",
                accessorKey: "status",
                meta: {
                    filterElement: function render(props: FilterElementProps) {
                        return (
                            <Select
                                defaultValue="published"
                                data={[
                                    { label: "Published", value: "published" },
                                    { label: "Draft", value: "draft" },
                                    { label: "Rejected", value: "rejected" },
                                ]}
                                {...props}
                            />
                        );
                    },
                    filterOperator: "eq",
                },
            },
            {
                id: "createdAt",
                header: "Created At",
                accessorKey: "createdAt",
                cell: function render({ getValue }) {
                    return (
                        <DateField value={getValue() as string} format="LLL" />
                    );
                },
                enableColumnFilter: false,
            },
            {
                id: "actions",
                header: "Actions",
                accessorKey: "id",
                enableColumnFilter: false,
                enableSorting: false,
                cell: function render({ getValue }) {
                    return (
                        <Group spacing="xs" noWrap>
                            <EditButton
                                hideText
                                onClick={() =>
                                    showEditModal(getValue() as number)
                                }
                            />
                            <DeleteButton
                                hideText
                                recordItemId={getValue() as number}
                            />
                        </Group>
                    );
                },
            },
        ],
        [],
    );

    const {
        getHeaderGroups,
        getRowModel,
        refineCore: { setCurrent, pageCount, current },
    } = useTable({
        columns,
    });

    return (
        <>
            <CreatePostModal {...createModalForm} />
            <EditPostModal {...editModalForm} />
            <ScrollArea>
                <List createButtonProps={{ onClick: () => showCreateModal() }}>
                    <Table highlightOnHover>
                        <thead>
                            {getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <th key={header.id}>
                                                {!header.isPlaceholder && (
                                                    <Group spacing="xs" noWrap>
                                                        <Box>
                                                            {flexRender(
                                                                header.column
                                                                    .columnDef
                                                                    .header,
                                                                header.getContext(),
                                                            )}
                                                        </Box>
                                                        <Group
                                                            spacing="xs"
                                                            noWrap
                                                        >
                                                            <ColumnSorter
                                                                column={
                                                                    header.column
                                                                }
                                                            />
                                                            <ColumnFilter
                                                                column={
                                                                    header.column
                                                                }
                                                            />
                                                        </Group>
                                                    </Group>
                                                )}
                                            </th>
                                        );
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {getRowModel().rows.map((row) => {
                                return (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <td key={cell.id}>
                                                    {flexRender(
                                                        cell.column.columnDef
                                                            .cell,
                                                        cell.getContext(),
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    <br />
                    <Pagination
                        position="right"
                        total={pageCount}
                        page={current}
                        onChange={setCurrent}
                    />
                </List>
            </ScrollArea>
        </>
    );
};
