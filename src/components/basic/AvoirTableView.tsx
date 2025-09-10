import {DataGrid, GridCellParams, GridColDef, GridRowsProp} from "@mui/x-data-grid";
import * as React from "react";

interface AvoirTableViewProps {
    columns: GridColDef[]
    rows: GridRowsProp | null | undefined
    isLoading: boolean
    isSelectable?: boolean
    isError?: boolean
    onClick?: (row: GridCellParams) => void
    errorOverride?: () => React.ReactElement;
    sx?: any
}

export function AvoirTableView(
    {
        columns,
        rows,
        isLoading,
        isSelectable,
        isError,
        onClick,
        errorOverride,
        sx,
    }: AvoirTableViewProps
) {
    if (isError && errorOverride) {
        return errorOverride()
    }

    return (
        <DataGrid
            rows={rows || []}
            columns={columns}
            columnHeaderHeight={52}
            rowHeight={68}
            onCellClick={onClick}
            loading={isLoading}
            showCellVerticalBorder={false}
            showColumnVerticalBorder={false}
            rowSpacingType={"margin"}
            disableColumnMenu
            disableRowSelectionOnClick
            hideFooter
            slotProps={{
                cell: {
                    style: {fontStyle: 'normal', fontSize: '0.9rem', fontWeight: 'bold'},
                },
                loadingOverlay: {
                    variant: 'skeleton',
                },
            }}
            sx={{
                ...sx,
                width: '100%',
                maxWidth: '100vw',
                overflowX: 'hidden',

                border: "0px solid transparent",
                backgroundColor: "background.paper",
                '--DataGrid-rowBorderColor': 'transparent', // Removes row dividers

                loadingOverlay: {
                    backgroundColor: "background.paper",
                },

                '& .MuiDataGrid-row': {
                    transition: 'all 0.2s ease-in-out', // Smooth transition
                    backgroundColor: "background.paper",
                    // borderBottom: 'none !important', // Removes row separators
                    // borderTop: 'none !important', // Remove top border
                    borderTop: '0.2px solid', // Add bottom border instead
                    borderColor: 'divider',
                },

                '& .MuiDataGrid-row:hover': {
                    backgroundColor: isSelectable == false ?  "transparent" : "background.hover",
                    // borderRadius: '12px', // Apply rounded corners
                    cursor: isSelectable == false ? 'default' : 'pointer',
                },

                '& .MuiDataGrid-columnHeaderTitle': {
                    color: 'text.secondary',
                    fontSize: '13px',
                    fontWeight: 'bold',
                },

                '& .MuiDataGrid-columnSeparator': {
                    display: 'none !important',
                },

                // HEADER (removes borders between headers)
                '& .MuiDataGrid-columnHeaders, & .MuiDataGrid-columnHeader': {
                    backgroundColor: "background.paper",
                    borderBottom: 'none !important', // Removes header bottom border
                },

                // Removes cell focus outline (optional)
                '& .MuiDataGrid-cell:focus': {
                    borderColor: 'transparent',
                    backgroundColor: 'transparent',
                    outline: 'none !important'
                },
                
                "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
                    outline: "none !important",
                },
            }}
        />
    )
}

