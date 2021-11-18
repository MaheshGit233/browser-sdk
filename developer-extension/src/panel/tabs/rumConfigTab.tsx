import { Table } from 'bumbag'
import React from 'react'
import { sendAction } from '../actions'
import { useStore } from '../useStore'

export function RumConfigTab() {
  const [{ config }] = useStore()
  sendAction('getConfig', undefined)
  return (
    config && (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeadCell>Attribute</Table.HeadCell>
            <Table.HeadCell>Value</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {Object.entries(config).map((entry) => (
            <Table.Row>
              <Table.Cell>{entry[0]}</Table.Cell>
              <Table.Cell>{JSON.stringify(entry[1])}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    )
  )
}