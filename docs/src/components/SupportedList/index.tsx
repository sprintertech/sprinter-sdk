import SankeyNetworkToken from "@site/src/components/SankeyNetworkToken";

export default function SupportedList() {
  return (
    <table>
      <thead>
        <tr>
          <th>Mainnet</th>
          <th>Testnet</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ verticalAlign: "top" }}>
            <SankeyNetworkToken url="https://api.sprinter.buildwithsygma.com/" />
          </td>
          <td style={{ verticalAlign: "top" }}>
            <SankeyNetworkToken url="https://api.test.sprinter.buildwithsygma.com/" />
          </td>
        </tr>
      </tbody>
    </table>
  );
}
