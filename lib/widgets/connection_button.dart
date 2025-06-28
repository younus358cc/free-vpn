import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/vpn_provider.dart';
import '../providers/server_provider.dart';

class ConnectionButton extends StatelessWidget {
  const ConnectionButton({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer2<VpnProvider, ServerProvider>(
      builder: (context, vpnProvider, serverProvider, child) {
        final selectedServer = serverProvider.selectedServer;
        
        return Center(
          child: GestureDetector(
            onTap: selectedServer != null
                ? () async {
                    if (vpnProvider.isConnected) {
                      await vpnProvider.disconnect();
                    } else if (!vpnProvider.isConnecting && !vpnProvider.isDisconnecting) {
                      await vpnProvider.connect(selectedServer);
                    }
                  }
                : null,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: RadialGradient(
                  colors: _getButtonColors(vpnProvider.status),
                ),
                boxShadow: [
                  BoxShadow(
                    color: _getButtonColors(vpnProvider.status)[0].withOpacity(0.3),
                    blurRadius: 20,
                    spreadRadius: 5,
                  ),
                ],
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  if (vpnProvider.isConnecting || vpnProvider.isDisconnecting)
                    const CircularProgressIndicator(
                      color: Colors.white,
                      strokeWidth: 3,
                    )
                  else
                    Icon(
                      _getButtonIcon(vpnProvider.status),
                      size: 50,
                      color: Colors.white,
                    ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }

  List<Color> _getButtonColors(VpnStatus status) {
    switch (status) {
      case VpnStatus.connected:
        return [const Color(0xFF4CAF50), const Color(0xFF45A049)];
      case VpnStatus.connecting:
      case VpnStatus.disconnecting:
        return [const Color(0xFFFF9800), const Color(0xFFF57C00)];
      case VpnStatus.error:
        return [const Color(0xFFF44336), const Color(0xFFD32F2F)];
      default:
        return [const Color(0xFF006A4E), const Color(0xFF004A37)];
    }
  }

  IconData _getButtonIcon(VpnStatus status) {
    switch (status) {
      case VpnStatus.connected:
        return Icons.stop;
      case VpnStatus.connecting:
      case VpnStatus.disconnecting:
        return Icons.hourglass_empty;
      case VpnStatus.error:
        return Icons.error;
      default:
        return Icons.power_settings_new;
    }
  }
}