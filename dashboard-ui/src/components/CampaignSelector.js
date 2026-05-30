export default function CampaignSelector({ campaigns, selected, onSelect }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {campaigns.map(c => (
        <button
          key={c.campaignId}
          onClick={() => onSelect(c.campaignId)}
          style={{
            padding: '6px 16px',
            borderRadius: 20,
            border: '1px solid',
            borderColor: selected === c.campaignId ? '#6366f1' : '#ffffff1a',
            background: selected === c.campaignId ? '#6366f1' : 'transparent',
            color: selected === c.campaignId ? '#fff' : '#8892a4',
            fontWeight: selected === c.campaignId ? 600 : 400,
            cursor: 'pointer',
            fontSize: 13,
            transition: 'all 0.2s',
          }}
        >
          {c.campaignId}
        </button>
      ))}
    </div>
  );
}
